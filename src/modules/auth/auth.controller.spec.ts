import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/create-auth.dto';
import { RegisterDto } from './entities/register.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './guards/auth-guard';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    authenticate: jest.fn(),
    register: jest.fn(),
  };

  const mockJwtService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should authenticate and return a token', async () => {
      const authDto: AuthDto = { username: 'test', password: 'password' };
      const expectedResult = {
        accessToken: 'token',
        userId: '1',
        username: 'test',
      };
      mockAuthService.authenticate.mockResolvedValue(expectedResult);

      const result = await controller.login(authDto);
      expect(result).toEqual(expectedResult);
      expect(mockAuthService.authenticate).toHaveBeenCalledWith(authDto);
    });
  });

  describe('register', () => {
    it('should register a user and return a token', async () => {
      const registerDto: RegisterDto = {
        username: 'newuser',
        password: 'password',
        email: 'test@example.com',
      };
      const expectedResult = {
        accessToken: 'token',
        userId: '2',
        username: 'newuser',
      };
      mockAuthService.register.mockResolvedValue(expectedResult);

      const result = await controller.register(registerDto);
      expect(result).toEqual(expectedResult);
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('getProfile', () => {
    it('should return the user from the request', () => {
      const user = { userId: '1', username: 'test' };
      const result = controller.getProfile(user);
      expect(result).toEqual(user);
    });
  });
});
