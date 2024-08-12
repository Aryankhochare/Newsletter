using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace Newsletter.Models
{
    [Table("NewsTest")]
    public class NewsTest : BaseModel
    {
        [PrimaryKey("id",false)]
        public string Id { get; set; }
        [Column("title")]
        public string Title { get; set; }
        [Column("editorcontent")]
        public string EditorContent { get; set; }
    }
}
