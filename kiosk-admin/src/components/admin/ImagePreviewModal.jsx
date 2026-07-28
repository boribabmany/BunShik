import { useEffect } from "react";
import "../../styles/ImagePreviewModal.css";

export default function ImagePreviewModal({ imageUrl, alt, onClose }) {
  useEffect(() => {
    if (!imageUrl) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [imageUrl, onClose]);

  if (!imageUrl) return null;

  return (
    <div
      className="image-preview-modal"
      role="dialog"
      aria-modal="true"
      aria-label={`${alt || "이미지"} 확대 보기`}
      onClick={onClose}
    >
      <div
        className="image-preview-content"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="image-preview-close"
          aria-label="확대 이미지 닫기"
          onClick={onClose}
        >
          ×
        </button>
        <img src={imageUrl} alt={alt || "확대 이미지"} />
      </div>
    </div>
  );
}
