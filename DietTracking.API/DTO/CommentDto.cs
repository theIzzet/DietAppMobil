namespace DietTracking.API.DTO
{
    public class CommentDto
    {
        public int CommentId { get; set; }
        public string? CommentText { get; set; }
        public DateTime PublishedOn { get; set; }
        public int Rating { get; set; }
        public string? UserId { get; set; }
        public string? UserName { get; set; }
        public string? UserSurname { get; set; }
    }
}
