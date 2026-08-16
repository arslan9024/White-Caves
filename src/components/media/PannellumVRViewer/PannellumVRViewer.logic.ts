import { useState, useCallback } from 'react';

export function usePannellumVRViewerLogic() {
  const [activeRoom, setActiveRoom] = useState('Living Room');
  const [isVirtualStagingActive, setIsVirtualStagingActive] = useState(true);

  const selectRoom = useCallback((roomName: string) => {
    setActiveRoom(roomName);
  }, []);

  const toggleVirtualStaging = useCallback(() => {
    setIsVirtualStagingActive((prev) => !prev);
  }, []);

  return {
    activeRoom,
    isVirtualStagingActive,
    selectRoom,
    toggleVirtualStaging,
  };
}
