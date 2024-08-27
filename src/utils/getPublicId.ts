export const getPublicId = (url: string): string => {
  const regex = /\/upload\/(?:v\d+\/)?([^/.]+)\.[a-z]+$/;
  const match = url.match(regex);

  if (match && match[1]) {
    return match[1];
  }

  return "";
};
