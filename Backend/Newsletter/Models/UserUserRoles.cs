using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;


namespace Newsletter.Models
{
    [Table("UserUserRoles")]
    public class UserUserRoles : BaseModel
    {
        [PrimaryKey("id",false)]
        public long UserUserRoleId { get; set; }
        [Column("user_id")]
        public long UserId { get; set; }
      
        [Column("user_role_id")]
        public long UserRoleId { get; set; }

     
    }
}
