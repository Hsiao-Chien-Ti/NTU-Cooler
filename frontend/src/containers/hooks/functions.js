export const makeName = (name, to) => {
  return [name, to].sort().join("_");
};

export const dataURItoBlob = (dataURI) => {
  var mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
  var binary = atob(dataURI.split(',')[1]);
  var array = [];
  for (var i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  const blob = new Blob([new Uint8Array(array)], { type: mime });
  return URL.createObjectURL(blob);
}