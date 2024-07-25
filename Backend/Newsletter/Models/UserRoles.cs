using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;
using System.Diagnostics.Eventing.Reader;
using System.Globalization;

namespace Newsletter.Models
{
    [Table("UserRoles")]
    public class UserRoles : BaseModel
    {
        [PrimaryKey("user_role_id",false)]
        public long UserRoleId { get; set; }
        [Column("user_role_name")]
        public string UserRoleName { get; set; }

    }
}
