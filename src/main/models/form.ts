export class FormData {
  flagComment: string | undefined;
  flagComment_cy: string | undefined;
  subTypeValue: string | undefined;
  subTypeValue_cy: string | undefined;
}

export class Form {
  data: { [key: string]: FormData } | undefined;
  enabled: string[] = [];
  selected: string | undefined;
}
