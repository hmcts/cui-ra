import { Transform } from 'class-transformer';

export class FormData {
  flagComment: string | undefined;
  flagComment_cy: string | undefined;
  subTypeValue: string | undefined;
  subTypeValue_cy: string | undefined;
}

export class Form {
  data: { [key: string]: FormData } | undefined;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return [value];
    }
    return value;
  })
  enabled: string[] = [];

  selected: string | undefined;
}
