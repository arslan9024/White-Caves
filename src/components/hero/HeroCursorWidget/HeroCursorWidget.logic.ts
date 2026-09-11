import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import en from './data/en.json';
import ar from './data/ar.json';
export const useHeroCursorLogic = () => { const isRtl = useSelector((s: RootState) => s.language.isRtl); return { t: isRtl ? ar : en, isRtl }; };
