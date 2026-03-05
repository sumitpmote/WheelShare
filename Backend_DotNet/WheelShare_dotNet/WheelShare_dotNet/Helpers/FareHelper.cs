namespace WheelShare_dotNet.Helpers
{
    public class FareHelper
    {

        private readonly IConfiguration _config;

        public FareHelper(IConfiguration config)
        {
            _config = config;
        }

        public decimal CalculateEstimatedFare(double distanceKm)
        {
            decimal baseFare = _config.GetValue<decimal>("FareConfig:BaseFare");
            decimal perKmRate = _config.GetValue<decimal>("FareConfig:PerKmRate");

            return baseFare + (decimal)distanceKm * perKmRate;
        }

        public decimal CalculateDriverEarning(decimal estimatedFare)
        {
            decimal commissionPercent =
                _config.GetValue<decimal>("CommissionConfig:DriverCommissionPercent");

            decimal commission = (commissionPercent / 100) * estimatedFare;

            return estimatedFare - commission;
        }

    }
}
