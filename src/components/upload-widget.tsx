import { useEffect, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadWidgetProps } from "@/types";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/constants";

const UploadWidget = ({ value, onChange, disabled = false }: UploadWidgetProps) => {
  const [widget, setWidget] = useState<CloudinaryWidget | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Cloudinary script if not already loaded
    if (!window.cloudinary && CLOUDINARY_CLOUD_NAME) {
      const script = document.createElement("script");
      script.src = `https://widget.cloudinary.com/v2.0/global/all.js`;
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        initializeWidget();
      };
    } else if (window.cloudinary && CLOUDINARY_CLOUD_NAME) {
      initializeWidget();
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  const initializeWidget = () => {
    if (!window.cloudinary || !CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      console.warn("Cloudinary configuration is missing");
      return;
    }

    const uploadWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET,
        multiple: false,
        sources: ["local", "camera", "url"],
        showAdvancedOptions: false,
        cropping: false,
        resourceType: "image",
      },
      (error, result) => {
        if (error) {
          console.error("Upload error:", error);
          return;
        }

        if (result && result.event === "success") {
          const uploadResult = {
            url: result.info.secure_url,
            publicId: result.info.public_id,
          };
          onChange?.(uploadResult);
        }
      }
    );

    setWidget(uploadWidget);
  };

  const handleUploadClick = () => {
    if (widget && !disabled) {
      widget.open();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(null);
  };

  if (value?.url) {
    return (
      <div className="upload-preview">
        <img src={value.url} alt="Upload preview" />
        {!disabled && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={handleRemove}
            className="absolute top-2 right-2"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      ref={widgetRef}
      className="upload-dropzone"
      onClick={handleUploadClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !disabled) {
          e.preventDefault();
          handleUploadClick();
        }
      }}
    >
      <div className="upload-prompt">
        <Upload className="icon" />
        <div>
          <div>Click to upload</div>
          <div>PNG, JPG, WEBP up to 3MB</div>
        </div>
      </div>
    </div>
  );
};

export default UploadWidget;
