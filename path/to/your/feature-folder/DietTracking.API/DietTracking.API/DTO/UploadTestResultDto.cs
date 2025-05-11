using System;
using Microsoft.AspNetCore.Http;
namespace DietTracking.API.DTO
{
    // Yükleme sırasında kullanacağız
    public class UploadTestResultDto
    {
        // Zorunlu: Tahlil adı
        public string TestName { get; set; }

        // Zorunlu: Tahlil tarihi
        public DateTime Date { get; set; }

        // Zorunlu: Fotoğraf veya PDF dosyası
        public IFormFile File { get; set; }

        // İsteğe bağlı: Ek not
        public string? Notes { get; set; }
    }
}
