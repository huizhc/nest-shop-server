/*
 * @Author: huizhc 1125133876@qq.com
 * @Date: 2022-05-28 11:41:52
 * @LastEditors: huizhc 1125133876@qq.com
 * @LastEditTime: 2022-05-29 09:52:31
 * @FilePath: \blog-serve\src\modules\article\dto\id.dto.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ApiProperty } from "@nestjs/swagger";

export class IdDTO {
  @ApiProperty({
    description: '分类id',
    example: 1,
  })
  readonly id: string
}