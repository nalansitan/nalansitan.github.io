import { GET as getOgImage, getOgImagePaths } from "../../og-image/[...slug].png";

export const getStaticPaths = () => getOgImagePaths("en");
export const GET = getOgImage;
