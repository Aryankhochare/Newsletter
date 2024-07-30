using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;


namespace Newsletter.Models
{
    [Table("UserUserRoles")]
    public class UserUserRoles : BaseModel
    {
        [PrimaryKey("id",false)]
        public string Id { get; set; }
        [Column("user_id")]
        public string UserId { get; set; }
      
        [Column("user_role_id")]
        public long UserRoleId { get; set; }

     
    }
}
