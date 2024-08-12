using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace Newsletter.Models
{
    [Table("Category")]
    public class Category : BaseModel
    {
        [PrimaryKey("category_id",false)]
        public string CategoryId { get; set; }
        [Column("category_name")]
        public string CategoryName { get; set; }
    }
}
