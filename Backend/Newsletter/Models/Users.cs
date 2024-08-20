using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace Newsletter.Models
{
    [Table("Users")]
    public class Users:BaseModel
    {
        [PrimaryKey("user_id",false)]
        public string Id { get; set; }
        [Column("username")]
        public string Username { get; set; }
        [Column("password")]
        public string? Password { get; set; }
        [Column("user_email")]
        public string Email { get; set; }
        [Column("is_active")]
        public bool isActive { get; set; }
        [Column("status")]
        public string Status {  get; set; }
        [Column("created_date")]
        public DateTime CreatedDate { get; set; }
        [Column("modified_date")]
        public DateTime ModifiedDate { get; set; }

    }
}
