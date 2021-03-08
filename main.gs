const onOpen = () => {
  DocumentApp.getUi().createMenu('Utilities')
      .addItem('Start GDocs-Paper', 'loopMarkdown')
      .addToUi();
}

const loopMarkdown = () => {
  while (true) {
    monospaceBackticks();
    replaceDateCommand();
    hashtagToHeaders();
    // TODO: Checkboxes?
    DocumentApp.getActiveDocument().saveAndClose();
  }
}

const getDateString = () => {
  const date = (new Date).toLocaleDateString('default', { day: 'numeric', month: 'long', year: 'numeric'});
  return date;
}

const replaceDateCommand = () => {
  const body = DocumentApp.getActiveDocument().getBody();
  const pattern = "/date";
  body.replaceText(pattern, getDateString());
}

// probably augment this to only operate on selection LOL
const monospaceBackticks = () => {
  const body = DocumentApp.getActiveDocument().getBody();
  const background = '#fff2cc';
  const pattern = "`.*?`";
  let found = body.findText(pattern);
  while (found) {
    const element = found.getElement();
    const text = element.asText();
    const start = found.getStartOffset();
    const endInclusive = found.getEndOffsetInclusive();
    // highlight and font
    text.setBackgroundColor(start, endInclusive, background);
    text.setFontFamily(start, endInclusive, "Consolas");
    // remove backticks
    text.deleteText(endInclusive, endInclusive);
    text.deleteText(start, start);
    // TODO: add some way to do default style afterwards.
    found = body.findText(pattern, found);
  }
}

// TODO: support more than one #
const hashtagToHeaders = () => {
  const body = DocumentApp.getActiveDocument().getBody();
  const pattern = "# ";
  let found = body.findText(pattern);
  while (found) {
    // only upcase if the # is at the beginning of the line
    const start = found.getStartOffset()
    if (start == 0) {
      const element = found.getElement();
      const text = element.asText();
      text.deleteText(start, start + 1);
      element.getParent().asParagraph().setHeading(DocumentApp.ParagraphHeading.HEADING1);
    }
    found = body.findText(pattern, found);
  }
}
