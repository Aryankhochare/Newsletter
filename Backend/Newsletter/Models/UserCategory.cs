using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace Newsletter.Models
{
    [Table("UserCategory")]
    public class UserCategory : BaseModel
    {
        [PrimaryKey("user_category_id", false)]
        public string UserCategoryId { get; set; }

        [Column("user_id")]
        public string UserId { get; set; }

        [Column("category_id")]
        public string CategoryId { get; set; }
    }
}
