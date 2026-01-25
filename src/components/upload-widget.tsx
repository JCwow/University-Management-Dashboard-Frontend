import { useEffect, useRef, useState } from "react";
import { Upload, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadWidgetProps, UploadWidgetValue } from "@/types";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET, MAX_FILE_SIZE } from "@/constants";

const UploadWidget = ({ value = null, onChange, disabled = false }: UploadWidgetProps) => {
  const [widget, setWidget] = useState<CloudinaryWidget | null>(null);
  const widgetRef = useRef<CloudinaryWidget | null>(null);
  const onChangeRef = useRef(onChange)
  const [preview, setPreview] = useState<UploadWidgetValue | null>(value);
  const [deleteToken, setDeleteToken] = useState<string | null>(null);
  
  
  useEffect(() => {
    setPreview(value)
    if(!value) setDeleteToken(null);
  }, [value]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange])

  useEffect(() => {
    if(typeof window === 'undefined') return;
    const initializeWidget =() => {
      if(!window.cloudinary || widgetRef.current) return false;
      widgetRef.current = window.cloudinary.createUploadWidget({
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET,
        multiple: false,
        folder: 'uploads',
        maxFileSize: 5000000,
        clientAllowedFormats: ['png', 'jpg','jpeg', 'webp'] 
      }, (error, result) => {
        if(!error && result.event === 'success'){
          const payload: UploadWidgetValue = {
            url: result.info.secure_url,
            publicId: result.info.public_id
          }
          setPreview(payload)

          setDeleteToken(result.info.delete_token ?? null);
        
          onChangeRef.current?.(payload)
        }
        
      })
      return true
    }
    if(initializeWidget()){
      return;
    }
    const intervalId = window.setInterval(() => {
      if(initializeWidget()){
        window.clearInterval(intervalId);
      }
    }, 500)

    return () => window.clearInterval(intervalId);
  }, [])


  const openWidget = () => {
    if(!disabled) widgetRef.current?.open();
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
    <div className="space-y-2">
      {preview ? (
        <div className="upload-preview">
          <img src={preview.url} alt="Uploaded file"></img>
        </div>
      ): <div className="upload-dropzone" role="button" 
      tabIndex={0} onClick={openWidget}
      onKeyDown={(event) => {
        if(event.key === 'Enter'){
          event.preventDefault();
          openWidget();
        }
      }}>
        <div className="upload-prompt">
          <UploadCloud className="icon">
          </UploadCloud>
          <div>
            <p>Click to upload photo</p>
            <p>PNG, JPG, up to 5MB</p>
          </div>
        </div>
        </div>}
    </div>
  );
};

export default UploadWidget;
