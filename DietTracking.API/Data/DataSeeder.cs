using DietApp.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DietTracking.API.Data
{
    public static class DataSeeder
    {
        public static async Task SeedDietTypes(ApplicationDbContext context)
        {
            if (!await context.DietTypes.AnyAsync()) // Eğer veri yoksa ekle
            {
                var dietTypes = new List<DietType>
                {
                    new DietType { Title = "Obezite ve Kilo Kontrolü", Description = "Obezite ile problem yaşayan bireyler için.", About = "Kilo kontrolü diyeti, kişinin kilo vermesi veya alması için kalori alımını düzenleyen bir beslenme programıdır. Dengeli beslenme, porsiyon kontrolü ve fiziksel aktivite ile desteklenmelidir." },

                    new DietType
                    {
                        Title = "Vegan Diyet",
                        Description = "Hayvansal gıdaları içermeyen bitkisel bazlı beslenme.",
                        About = "Vegan beslenme, sebzeler, meyveler, tahıllar, baklagiller, kuruyemişler ve tohumları içerir. Etik ve çevresel sebeplerle tercih edilebilir. Protein ve B12 eksikliğini önlemek için dengeli bir planlama gerektirir.",
                        PicturePath = "/images/vegan.jpg"
                    },

                    new DietType
                    {
                        Title = "Akdeniz Diyeti",
                        Description = "Sağlıklı yağlar, sebzeler ve tam tahıllarla beslenme.",
                        About = "Akdeniz diyeti, zeytinyağı, sebze, meyve, tam tahıllar, balık ve kuruyemiş açısından zengin bir diyet türüdür. Kalp hastalıkları riskini azaltabilir, beyin sağlığını destekleyebilir ve uzun ömürle ilişkilendirilmiştir.",

                    },
                    new DietType
                    {
                        Title = "Paleo Diyet",
                        Description = "İşlenmiş gıdalardan uzak, doğal beslenme.",
                        About = "Paleo diyeti, taş devri insanlarının beslenme şeklini temel alır. İşlenmiş gıdalardan kaçınarak et, balık, sebze, meyve ve sağlıklı yağları tüketmeyi önerir. Bu diyet, kilo kontrolü ve sindirim sağlığı açısından faydalı olabilir.",

                    },




                    new DietType
                        {
                            Title = "Emzirme Dönemi Beslenme",
                            Description = "Anne sütü üretimini destekleyen beslenme şekli.",
                            About = "Emzirme döneminde sağlıklı beslenme, hem annenin enerjisini korumasını hem de bebeğin ihtiyaç duyduğu besinleri almasını sağlar. Bol sıvı tüketimi, protein, kalsiyum ve sağlıklı yağlardan zengin beslenme önerilir.",

                        },


                    new DietType
                    {
                        Title = "Sporcu Beslenmesi",
                        Description = "Aktif yaşam süren bireyler için beslenme programı.",
                        About = "Sporcu beslenmesi, enerji seviyelerini artırmayı, kas gelişimini desteklemeyi ve egzersiz performansını en üst düzeye çıkarmayı hedefler. Protein, karbonhidrat ve sağlıklı yağların dengeli bir şekilde tüketilmesini içerir.",

                    },
                    new DietType
                    {
                        Title = "Hamilelikte Beslenme",
                        Description = "Anne ve bebeğin sağlığı için özel beslenme programı.",
                        About = "Hamilelikte beslenme, annenin ve bebeğin ihtiyaçlarını karşılayacak şekilde dengeli ve besleyici olmalıdır. Folik asit, demir, kalsiyum ve protein açısından zengin gıdalar tüketilmelidir. Sağlıklı kilo alımı ve gelişim için önemlidir.",

                    },
                    new DietType
                    {
                        Title = "Ketojenik Diyet",
                        Description = "Düşük karbonhidrat, yüksek yağ içeren bir beslenme şekli.",
                        About = "Ketojenik diyet, vücudu ketozis adı verilen bir duruma sokarak yağ yakımını hızlandırır. Kan şekerini dengeleyebilir ve epilepsi, diyabet gibi hastalıklar üzerinde olumlu etkileri olabilir. Genellikle et, yumurta, süt ürünleri, sebzeler ve sağlıklı yağlarla uygulanır.",

                    },

                    new DietType
                    {
                        Title = "Düşük Karbonhidrat Diyeti",
                        Description = "Şeker ve karbonhidrat tüketimini azaltan diyet.",
                        About = "Düşük karbonhidrat diyeti, işlenmiş şekerleri ve nişastaları azaltarak sağlıklı yağlar ve proteinlere odaklanır. Kan şekeri seviyelerini dengeleyebilir, kilo kaybını hızlandırabilir ve enerji seviyelerini artırabilir.",

                    }




                };

                await context.DietTypes.AddRangeAsync(dietTypes);
                await context.SaveChangesAsync();
            }
        }
    }
}
