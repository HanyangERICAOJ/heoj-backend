import { IsNotEmpty, IsNumberString, Length, Validate } from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';
import { StudentIdNotExistConstraint } from '../constraints/studentId-not-exist.constraint';
import { UsernameNotExistConstraint } from '../constraints/username-not-exist.constraint';
class CreateUserDTO {
  @Length(6, 12, {
    message: '사용자 이름은 6자 이상 12자 이하만 가능합니다.',
  })
  @Validate(UsernameNotExistConstraint)
  username: string;

  @Length(6, 20, {
    message: '비밀번호는 6자 이상 20자 이하만 가능합니다.',
  })
  password: string;

  @Match(CreateUserDTO, (s) => s.password, {
    message: '비밀번호가 일치하지 않습니다.',
  })
  password2: string;

  @IsNumberString(undefined, {
    message: '학번은 숫자로 이루어져 있어야합니다.',
  })
  @IsNotEmpty({
    message: '학번을 작성해주세요.',
  })
  @Validate(StudentIdNotExistConstraint)
  studentId: string;
}

export default CreateUserDTO;
