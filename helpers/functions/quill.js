import $ from "jquery";

const quillToReact = (text) => {
  // ------------- From Mobile -> Web ------------
  var _richText;

  try {
    _richText = text
      .replace(/(?:https?|ftp)\/\/[\n\S]+/g, "")
      .replace(/"b":true/g, `"bold":true`)
      .replace(/"i":true/g, `"italic":true`)
      .replace(/{"block":"ol"}/g, `{"list":"ordered"}`)
      .replace(/{"block":"ul"}/g, `{"list":"bullet"}`)
      .replace(/{"block":"quote"}/g, `{"blockquote":true}`)
      .replace(/\n/g, "\\n");
  } catch (error) {}
  let images_url = _richText.match(/\bhttps?:\/\/\S+/gi);
  if (images_url) {
    images_url.forEach(function (part, index, theArray) {
      images_url[index] = images_url[index].split('"')[0];
    });
  }

  if (images_url && _richText)
    for (let i = 0; i < images_url.length; i++) {
      if (images_url[i].match(/\bhttps?:\/\/firebase\S+/gi)) {
        _richText = _richText.replace(
          `{"insert":"​","attributes":{"embed":{"type":"image","source":"${images_url[i]}"}}}`,
          `{"insert":{"image":"${images_url[i]}"}}`
        );
      } else {
        let richTextNonStringify = $.parseJSON(text);

        let updated_answer_images = [];
        for (let i = 0; i < richTextNonStringify.length; i++) {
          if (richTextNonStringify[i]?.insert?.image) {
            updated_answer_images.push(richTextNonStringify[i]?.insert?.image);
          }

          if (
            richTextNonStringify[i]?.attributes?.a &&
            richTextNonStringify[i]?.insert
          ) {
            if (
              richTextNonStringify[i]?.attributes?.i &&
              richTextNonStringify[i]?.attributes?.b
            ) {
              // make sure to convert the italic text
              _richText = _richText.replace(
                `{"insert":"${richTextNonStringify[i]?.insert}","attributes":{"italic":true,"bold":true,"a":"${richTextNonStringify[i]?.attributes?.a}"}}`,
                `{"attributes":{"link":"${richTextNonStringify[i]?.attributes?.a}","italic":true,"bold":true},"insert":"${richTextNonStringify[i]?.insert}"}`
              );
            } else if (richTextNonStringify[i]?.attributes?.b) {
              _richText = _richText.replace(
                `{"insert":"${richTextNonStringify[i]?.insert}","attributes":{"bold":true,"a":"${richTextNonStringify[i]?.attributes?.a}"}}`,
                `{"attributes":{"link":"${richTextNonStringify[i]?.attributes?.a}","bold":true},"insert":"${richTextNonStringify[i]?.insert}"}`
              );
            } else if (richTextNonStringify[i]?.attributes?.i) {
              // make sure to convert the italic text

              _richText = _richText.replace(
                `{"insert":"${richTextNonStringify[i]?.insert}","attributes":{"italic":true,"a":"${richTextNonStringify[i]?.attributes?.a}"}}`,
                `{"attributes":{"link":"${richTextNonStringify[i]?.attributes?.a}","italic":true},"insert":"${richTextNonStringify[i]?.insert}"}`
              );
            } else {
              _richText = _richText.replace(
                `{"insert":"${richTextNonStringify[i]?.insert}","attributes":{"a":"${richTextNonStringify[i]?.attributes?.a}"}}`,
                `{"attributes":{"link":"${richTextNonStringify[i]?.attributes?.a}"},"insert":"${richTextNonStringify[i]?.insert}"}`
              );
            }
          }
        }
      }
    }

  // before return we need to get rid of blank paragraph
  _richText.replace(/\n\n/g, "");

  return _richText;
};

const quillToPlainText = (text) => {
  // ------------- From RichText -> PlainText ------------
  let _richText = text
    .replace(/insert:/g, "")
    .replace(/"b":true/g, ``)
    .replace(/"i":true/g, ``)
    .replace(/"underline":true/g, ``)
    .replace(/block:ul/g, ``)
    .replace(/attributes/g, "")
    .replace(/{"embed":{"type":"image","source"/g, "")
    .replace(/"a"/g, ``)
    .replace(/\\n/g, " ")
    .replace(/insert/g, "")
    .replace(/"/g, "")
    .replace(/{/g, "")
    .replace(/}/g, "")
    .replace(/]/g, "")
    .replace(/\[/g, "")
    .replace(/,/g, "")
    .replace(/:/g, "")
    .replace(/blockul/g, ``)
    .replace(/blockol/g, ``)
    .replace(/(?:https?|ftp)\/\/[\n\S]+/g, "")
    .replace(/\n/g, " ");
  return _richText;
};

const reactToQuill = (text) => {
  // ------------- From Web -> Mobile ------------
  var _richText = text
    .replace(/"bold":true/g, `"b":true`)
    .replace(/"italic":true/g, `"i":true`)
    .replace(/{"list":"ordered"}/g, `{"block":"ol"}`)
    .replace(/{"list":"bullet"}/g, `{"block":"ul"}`)
    .replace(/{"blockquote":true}/g, `{"block":"quote"}`);

  let images_url = _richText.match(/\bhttps?:\/\/\S+/gi);
  if (images_url) {
    images_url.forEach(function (part, index, theArray) {
      images_url[index] = images_url[index].split('"')[0];
    });
  }
  //let parsedRichText = JSON.parse(_richText);

  if (images_url && _richText)
    for (let i = 0; i < images_url.length; i++) {
      if (images_url[i].match(/\bhttps?:\/\/firebase\S+/gi)) {
        _richText = _richText.replace(
          `{"insert":{"image":"${images_url[i]}"}}`,
          `{"insert":"​","attributes":{"embed":{"type":"image","source":"${images_url[i]}"}}}`
        );
      } else {
        let richTextNonStringify = $.parseJSON(text);

        let updated_answer_images = [];
        for (let i = 0; i < richTextNonStringify.length; i++) {
          if (richTextNonStringify[i]?.insert?.image) {
            updated_answer_images.push(richTextNonStringify[i]?.insert?.image);
          }

          if (
            richTextNonStringify[i]?.attributes?.link &&
            richTextNonStringify[i]?.insert
          ) {
            if (
              richTextNonStringify[i]?.attributes?.i &&
              richTextNonStringify[i]?.attributes?.b
            ) {
              // make sure to convert the italic text

              _richText = _richText.replace(
                `{"attributes":{"i":true,"b":true,"link":"${richTextNonStringify[i]?.attributes?.link}"},"insert":"${richTextNonStringify[i]?.insert}"}`,
                `{"insert":"${richTextNonStringify[i]?.insert}","attributes":{"i":true,"b":true,"a":"${richTextNonStringify[i]?.attributes?.link}"}}`
              );
            } else if (richTextNonStringify[i]?.attributes?.i) {
              // make sure to convert the italic text

              _richText = _richText.replace(
                `{"attributes":{"i":true,"link":"${richTextNonStringify[i]?.attributes?.link}"},"insert":"${richTextNonStringify[i]?.insert}"}`,
                `{"insert":"${richTextNonStringify[i]?.insert}","attributes":{"i":true,"a":"${richTextNonStringify[i]?.attributes?.link}"}}`
              );
            } else if (richTextNonStringify[i]?.attributes?.b) {
              // make sure to convert the italic text

              _richText = _richText.replace(
                `{"attributes":{"b":true,"link":"${richTextNonStringify[i]?.attributes?.link}"},"insert":"${richTextNonStringify[i]?.insert}"}`,
                `{"insert":"${richTextNonStringify[i]?.insert}","attributes":{"b":true,"a":"${richTextNonStringify[i]?.attributes?.link}"}}`
              );
            } else {
              _richText = _richText.replace(
                `{"attributes":{"link":"${richTextNonStringify[i]?.attributes?.link}"},"insert":"${richTextNonStringify[i]?.insert}"}`,
                `{"insert":"${richTextNonStringify[i]?.insert}","attributes":{"a":"${richTextNonStringify[i]?.attributes?.link}"}}`
              );
            }
          }
        }
      }
    }
  return _richText;
};

export { quillToReact, reactToQuill, quillToPlainText };
