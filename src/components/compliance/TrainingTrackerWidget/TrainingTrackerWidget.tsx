import React, { FC } from 'react';
import { BookOpen, Calendar, Clock, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { useTrainingTrackerLogic } from './TrainingTrackerWidget.logic';
import {
  TrackerContainer,
  TrackerHeader,
  TitleBox,
  StatusBadge,
  ProgressSection,
  ProgressHeader,
  ProgressBarBg,
  ProgressBarFill,
  DeadlineBox,
  CoursesSection,
  CourseList,
  CourseCard,
  CourseInfo,
  ActionButton
} from './TrainingTrackerWidget.style';

export const TrainingTrackerWidget: FC = () => {
  const {
    t,
    isRtl,
    completedHours,
    targetHours,
    percentage,
    status,
    getStatusText,
    deadline,
    upcomingCourses,
    handleRegister
  } = useTrainingTrackerLogic();

  return (
    <TrackerContainer $isRtl={isRtl}>
      <TrackerHeader>
        <TitleBox>
          <h3><BookOpen size={20} /> {t.title}</h3>
          <p>{t.subtitle}</p>
        </TitleBox>
        <StatusBadge $status={status}>
          {status === 'compliant' && <CheckCircle size={16} />}
          {status === 'at_risk' && <AlertTriangle size={16} />}
          {status === 'non_compliant' && <AlertCircle size={16} />}
          {getStatusText()}
        </StatusBadge>
      </TrackerHeader>

      <ProgressSection>
        <ProgressHeader>
          <span>{t.progress_label}</span>
          <div className="hours">
            {completedHours} <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{t.of}</span> {targetHours} {t.hours}
          </div>
        </ProgressHeader>
        <ProgressBarBg>
          <ProgressBarFill $percentage={percentage} $status={status} />
        </ProgressBarBg>
      </ProgressSection>

      <DeadlineBox>
        <Calendar size={24} />
        <div>
          <span className="label">{t.deadline_label}</span>
          <span className="date">{deadline}</span>
        </div>
      </DeadlineBox>

      <CoursesSection>
        <h4>{t.upcoming_courses}</h4>
        <CourseList>
          {upcomingCourses.map(course => (
            <CourseCard key={course.id}>
              <CourseInfo>
                <span className="course-title">{course.title}</span>
                <div className="course-meta">
                  <span><Calendar size={14} /> {new Date(course.date).toLocaleDateString(isRtl ? 'ar-AE' : 'en-US')}</span>
                  <span><Clock size={14} /> {course.hours} {t.hours}</span>
                </div>
              </CourseInfo>
              <ActionButton 
                $variant="primary"
                onClick={() => handleRegister(course.id)}
              >
                {t.register_btn}
              </ActionButton>
            </CourseCard>
          ))}
        </CourseList>
      </CoursesSection>

    </TrackerContainer>
  );
};
