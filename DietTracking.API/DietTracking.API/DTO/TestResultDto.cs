using System;
namespace DietTracking.API.Dto
{
    // Görüntüleme / listeleme için kullanacağız
    public class TestResultDto
    {
        public int Id { get; set; }
        public string TestName { get; set; }
        public DateTime Date { get; set; }
        public string FilePath { get; set; }
        public string? Notes { get; set; }
    }
}
