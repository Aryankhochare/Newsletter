namespace Newsletter.ViewModels
{
    public class CreateNewsArticleVM
    {
        public string Title { get; set; }
        public string EditorContent { get; set; }

        public IFormFile CoverImage { get; set; }
    }
}
