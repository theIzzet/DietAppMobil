namespace DietTracking.API.DTO
{
    public class ChatMessageDto
    {
        public string FromUserId { get; set; }
        public string ToUserId { get; set; }
        public string Text { get; set; }
        public DateTime SentAt { get; set; }
    }
}
