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

const hashtagToHeaders = () => {
  const body = DocumentApp.getActiveDocument().getBody();
  const pattern = "#* ";
  let found = body.findText(pattern);
  while (found) {
    // only upcase if the # is at the beginning of the line
    const start = found.getStartOffset();
    if (start == 0) {
	  const length = found.getEndOffsetInclusive();
      const element = found.getElement();
      const text = element.asText();
      text.deleteText(start, length);
	  let heading;
	  switch (length) {
	  case 1:
		heading = DocumentApp.ParagraphHeading.HEADING1;
		break;
	  case 2:
		heading = DocumentApp.ParagraphHeading.HEADING2;
		break;
	  case 3:
		heading = DocumentApp.ParagraphHeading.HEADING3;
		break;
	  case 4:
		heading = DocumentApp.ParagraphHeading.HEADING4;
		break;
	  case 5:
		heading = DocumentApp.ParagraphHeading.HEADING5;
		break;
	  case 6:
		heading = DocumentApp.ParagraphHeading.HEADING6;
		break;
	  default:
		heading = null;
	  }
	  if (heading) {
		element.getParent().asParagraph().setHeading(heading);
	  }
    }
    found = body.findText(pattern, found);
  }
}
