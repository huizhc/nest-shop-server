import { ApiProperty } from "@nestjs/swagger";

export class IdDTO {
  @ApiProperty({
    description: '分类id',
    example: 1,
  })
  readonly id: string
}