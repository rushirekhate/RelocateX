namespace RelocateX.Domain.Entities
{
    public class Booking
    {
        public int Id { get; set; }

        public string? FullName { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? City { get; set; }
        public string? PickupLocation { get; set; }
        public string? DropLocation { get; set; }

        public DateTime? ShiftDate { get; set; }

        public string? HouseSize { get; set; }

        public DateTime? CreatedDate { get; set; }
    }
}