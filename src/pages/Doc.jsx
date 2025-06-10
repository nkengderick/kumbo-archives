import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Eye,
  Download,
  Share2,
  Edit,
  Trash2,
  User,
  FileText,
  Tag,
  Globe,
  Lock,
  MessageSquare,
  Send,
  MoreVertical,
  ExternalLink,
  Copy,
  FileIcon,
  History,
  X,
} from "lucide-react";
import { useDocuments } from "../context/DocumentContext";

const DocumentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentDocument,
    isLoading,
    error,
    fetchDocument,
    downloadDocument,
    toggleStar,
    deleteDocument,
    addComment,
  } = useDocuments();

  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  // Load document on mount
  useEffect(() => {
    if (id) {
      fetchDocument(id);
    }
  }, [id, fetchDocument]);

  // File type icons mapping
  const fileTypeIcons = {
    PDF: "📄",
    DOCX: "📝",
    XLSX: "📊",
    PPTX: "📋",
    JPG: "🖼️",
    PNG: "🖼️",
    MP4: "🎥",
    MP3: "🎵",
  };

  const getCategoryColor = (category) => {
    const colors = {
      Financial: "bg-blue-100 text-blue-700 border-blue-200",
      Legal: "bg-red-100 text-red-700 border-red-200",
      Administrative: "bg-green-100 text-green-700 border-green-200",
      Cultural: "bg-purple-100 text-purple-700 border-purple-200",
      Infrastructure: "bg-orange-100 text-orange-700 border-orange-200",
      Education: "bg-indigo-100 text-indigo-700 border-indigo-200",
      Healthcare: "bg-pink-100 text-pink-700 border-pink-200",
      Heritage: "bg-amber-100 text-amber-700 border-amber-200",
    };
    return colors[category] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const handleDownload = async () => {
    try {
      await downloadDocument(currentDocument._id, currentDocument.originalName);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleStar = async () => {
    try {
      await toggleStar(currentDocument._id);
    } catch (error) {
      console.error("Star toggle failed:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await deleteDocument(currentDocument._id);
        navigate("/documents");
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      await addComment(currentDocument._id, newComment);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Show toast notification
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-kumbo-green-200 border-t-kumbo-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error || !currentDocument) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Document Not Found</h1>
          <p className="text-gray-600 mb-4">{error || "The requested document could not be found."}</p>
          <button 
            onClick={() => navigate("/documents")}
            className="btn-primary"
          >
            Back to Documents
          </button>
        </div>
      </div>
    );
  }

  const document = currentDocument;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Navigation and title */}
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <button
                onClick={() => navigate("/documents")}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Documents</span>
              </button>
              
              <div className="w-px h-6 bg-gray-300"></div>
              
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-kumbo-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">
                    {fileTypeIcons[document.fileType] || "📄"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl font-bold text-gray-800 truncate">
                    {document.title}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {document.fileSizeFormatted || document.size} • {document.fileType}
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleStar}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  document.isStarred
                    ? "text-amber-500 bg-amber-50 hover:bg-amber-100"
                    : "text-gray-400 hover:text-amber-500 hover:bg-amber-50"
                }`}
              >
                <Star className={`w-5 h-5 ${document.isStarred ? "fill-current" : ""}`} />
              </button>

              <button
                onClick={() => setShowComments(!showComments)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
              </button>

              <button
                onClick={handleShare}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 px-4 py-2 bg-kumbo-green-600 text-white rounded-lg hover:bg-kumbo-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>

              <div className="relative">
                <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Document Preview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Document Preview</h2>
              </div>
              
              <div className="p-6">
                {/* Document viewer placeholder - In a real app, you'd implement actual document viewing */}
                <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                  <div className="text-center">
                    <FileIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Document Preview</h3>
                    <p className="text-gray-500 mb-4">
                      Preview for {document.fileType} files is not available yet
                    </p>
                    <button
                      onClick={handleDownload}
                      className="flex items-center space-x-2 mx-auto px-4 py-2 bg-kumbo-green-600 text-white rounded-lg hover:bg-kumbo-green-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download to View</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {document.description && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed">{document.description}</p>
              </div>
            )}

            {/* Keywords/Tags */}
            {document.keywords && document.keywords.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Keywords</h2>
                <div className="flex flex-wrap gap-2">
                  {document.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-kumbo-green-100 text-kumbo-green-700 hover:bg-kumbo-green-200 transition-colors cursor-pointer"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            {showComments && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Comments ({document.comments?.length || 0})
                  </h2>
                </div>

                {/* Add Comment Form */}
                <form onSubmit={handleAddComment} className="mb-6">
                  <div className="flex space-x-3">
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kumbo-green-500 focus:border-kumbo-green-500 resize-none"
                        rows="3"
                      />
                    </div>
                    <div className="flex flex-col justify-end">
                      <button
                        type="submit"
                        disabled={!newComment.trim() || isSubmittingComment}
                        className="px-4 py-2 bg-kumbo-green-600 text-white rounded-lg hover:bg-kumbo-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-4">
                  {document.comments && document.comments.length > 0 ? (
                    document.comments.map((comment, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-kumbo-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-kumbo-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-gray-800">
                                {comment.authorName || comment.author}
                              </span>
                              <span className="text-sm text-gray-500">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-700">{comment.content}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Document Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Document Information</h3>
              
              <div className="space-y-4">
                {/* Category */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Category</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(document.category)}`}>
                    {document.category}
                  </span>
                </div>

                {/* Author */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Author</span>
                  <span className="text-sm font-medium text-gray-800">
                    {typeof document.author === 'object' 
                      ? (document.author.name || document.author.username)
                      : document.author}
                  </span>
                </div>

                {/* Department */}
                {document.department && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Department</span>
                    <span className="text-sm font-medium text-gray-800">{document.department}</span>
                  </div>
                )}

                {/* Upload Date */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Created</span>
                  <span className="text-sm font-medium text-gray-800">
                    {new Date(document.createdAt || document.uploadDate).toLocaleDateString()}
                  </span>
                </div>

                {/* File Size */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">File Size</span>
                  <span className="text-sm font-medium text-gray-800">
                    {document.fileSizeFormatted || document.size}
                  </span>
                </div>

                {/* Language */}
                {document.language && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Language</span>
                    <span className="text-sm font-medium text-gray-800">{document.language}</span>
                  </div>
                )}

                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`text-sm font-medium ${
                    document.isPublic ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {document.isPublic ? (
                      <span className="flex items-center space-x-1">
                        <Globe className="w-3 h-3" />
                        <span>Public</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1">
                        <Lock className="w-3 h-3" />
                        <span>Private</span>
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistics</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Eye className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-gray-800">{document.viewCount || 0}</div>
                  <div className="text-xs text-gray-600">Views</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Download className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-gray-800">{document.downloadCount || 0}</div>
                  <div className="text-xs text-gray-600">Downloads</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => setShowVersionHistory(!showVersionHistory)}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <History className="w-4 h-4" />
                  <span>Version History</span>
                </button>
                
                <button className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <Edit className="w-4 h-4" />
                  <span>Edit Details</span>
                </button>
                
                <button className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <Copy className="w-4 h-4" />
                  <span>Duplicate</span>
                </button>
                
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Document</span>
                </button>
              </div>
            </div>

            {/* Version History */}
            {showVersionHistory && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Version History</h3>
                
                <div className="space-y-3">
                  {document.versions && document.versions.length > 0 ? (
                    document.versions.map((version, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-800">v{version.versionNumber}</div>
                          <div className="text-sm text-gray-600">
                            {new Date(version.uploadDate).toLocaleDateString()}
                          </div>
                        </div>
                        <button className="text-kumbo-green-600 hover:text-kumbo-green-700 text-sm">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500 text-sm">No version history available</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Share Document</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Link
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={window.location.href}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(window.location.href)}
                    className="px-3 py-2 bg-kumbo-green-600 text-white rounded-lg hover:bg-kumbo-green-700 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Email
                </button>
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentDetailPage;