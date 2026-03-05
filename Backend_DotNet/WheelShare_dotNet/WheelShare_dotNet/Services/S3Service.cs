using Amazon.S3;
using Amazon.S3.Model;

namespace WheelShare_dotNet.Services
{
    public class S3Service
    {
        private readonly IAmazonS3? _s3Client;
        private readonly string _bucketName;
        private readonly bool _isS3Available;

        public S3Service(IServiceProvider serviceProvider, IConfiguration configuration)
        {
            try
            {
                _s3Client = serviceProvider.GetService<IAmazonS3>();
                _isS3Available = _s3Client != null;
            }
            catch
            {
                _isS3Available = false;
            }
            _bucketName = configuration["AWS:BucketName"] ?? "wheelshare-user-documents";
        }

        public async Task<string> UploadFileAsync(IFormFile file, int userId, string userRole, string documentType)
        {
            if (!_isS3Available || _s3Client == null)
            {
                throw new Exception("S3 not configured - using local storage fallback");
            }

            try
            {
                var folder = userRole.ToLower() == "driver" ? "drivers" : "customers";
                var docFolder = documentType.ToLower();
                var key = $"{folder}/{userId}/{docFolder}/{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

                using var stream = file.OpenReadStream();
                
                var request = new PutObjectRequest
                {
                    BucketName = _bucketName,
                    Key = key,
                    InputStream = stream,
                    ContentType = file.ContentType,
                    ServerSideEncryptionMethod = ServerSideEncryptionMethod.AES256
                };

                await _s3Client.PutObjectAsync(request);
                return key;
            }
            catch (Exception ex)
            {
                throw new Exception($"S3 Upload failed: {ex.Message}");
            }
        }

        public string GeneratePresignedUrl(string key, int expirationMinutes = 60)
        {
            if (!_isS3Available || _s3Client == null)
            {
                return $"/uploads/{key}"; // Local file path
            }

            try
            {
                var request = new GetPreSignedUrlRequest
                {
                    BucketName = _bucketName,
                    Key = key,
                    Expires = DateTime.UtcNow.AddMinutes(expirationMinutes),
                    Verb = HttpVerb.GET
                };

                return _s3Client.GetPreSignedURL(request);
            }
            catch
            {
                return $"/uploads/{key}"; // Fallback to local path
            }
        }

        public async Task<bool> DeleteFileAsync(string key)
        {
            if (!_isS3Available || _s3Client == null)
            {
                return false;
            }

            try
            {
                await _s3Client.DeleteObjectAsync(_bucketName, key);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}