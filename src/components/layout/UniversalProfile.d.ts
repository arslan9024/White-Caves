declare module '../layout/UniversalProfile' {
  import { FC } from 'react';
  
  interface UniversalProfileProps {
    variant?: 'default' | 'compact';
    showSignIn?: boolean;
  }
  
  const UniversalProfile: FC<UniversalProfileProps>;
  export default UniversalProfile;
}
