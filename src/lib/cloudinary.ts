import { CLOUDINARY_CLOUD_NAME } from "@/constants"
import { fill } from "@cloudinary/url-gen/actions/resize"
import {Cloudinary} from "@cloudinary/url-gen"
import { text } from "@cloudinary/url-gen/qualifiers/source"
import { dpr, format, quality } from "@cloudinary/url-gen/actions/delivery"
import { source } from "@cloudinary/url-gen/actions/overlay";
import { TextStyle } from "@cloudinary/url-gen/qualifiers/textStyle"
import { Position } from "@cloudinary/url-gen/qualifiers"
import { compass } from "@cloudinary/url-gen/qualifiers/gravity"

// Fail-fast guard: ensure CLOUDINARY_CLOUD_NAME is configured before initializing Cloudinary
if (!CLOUDINARY_CLOUD_NAME || CLOUDINARY_CLOUD_NAME.trim() === "") {
    throw new Error(
        "CLOUDINARY_CLOUD_NAME is required but not configured. " +
        "Please set the VITE_CLOUDINARY_CLOUD_NAME environment variable."
    );
}

const cld = new Cloudinary({cloud: {cloudName: CLOUDINARY_CLOUD_NAME}})

export const bannerPhoto = (imageCldPubId: string, name: string) => {
    return cld
.image(imageCldPubId)
.resize(fill())
.delivery(format('auto'))
.delivery(quality('auto'))
.delivery(dpr('auto'))
.overlay(source(text(name, new TextStyle('roboto', 100).fontWeight('bold'))
.textColor('white')).position(new Position()
.gravity(compass('west'))
.offsetX(0.02))
)

}
