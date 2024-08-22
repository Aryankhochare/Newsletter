using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace Newsletter.Models
{
    [Table("News")]
    public class NewsArticle : BaseModel
    {
        [PrimaryKey("news_id", false)]
        public string Id { get; set; }

        [Column("user_id")]
        public string UserId { get; set; }

        [Column("category_id")]
        public string CategoryId { get; set; }

        [Column("news_title")]
        public string Title { get; set; }

        [Column("content")]
        public string EditorContent { get; set; }

        [Column("posted_on")]
        public DateTime PostedOn { get; set; }
        [Column("modified_on")]
        public DateTime ModifiedDate { get; set; }

        [Column("is_verified")]
        public bool IsVerified { get; set; }
        [Column("cover_image")]
        public string CoverImage { get; set; }
        [Column("is_rejected")]
        public bool IsRejected { get; set; }
        [Column("is_draft")]
        public bool IsDrafted { get; set; }
    }
}
