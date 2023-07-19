export default class SVG {
  constructor(data=[], vb="0 0 100 100") {
    this.data = [...data];
    this.vb = vb;

    this.mime = "data:image/svg+xml;utf8,";
    this.open = '<svg viewBox="__VB__" xmlns="http://www.w3.org/2000/svg">'
    this.close = '</svg>';
  }

  setData(data) {
    this.data = [...data];
  }

  setViewbox(vb) {
    this.vb = vb;
  }

  append(str) {
    this.data.push(str);
  }

  /*
    toUri()
    mime + open + data.replace.join("") + close
  */
  toURI() {
    let svg = this.mime;
    svg += this.open.replace("__VB__", this.vb);
    svg += this.data.map(s => s.replace(/#/g,"%23")).join("");
    svg += this.close;

    return svg;
  }

  /*
    toBgImage()
    Wrap uri in background-image
  */
  toBgImage() {
    return `background-image: url('${this.toURI()}');`;
  }
};
