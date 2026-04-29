import { PlatformPublisherForm } from '../../shared';

interface PublishState {
  [key: string]: unknown;
}

interface PublishTabProps {
  state: PublishState;
}

export default function PublishTab({ state }: PublishTabProps) {
  const { } = state;

  return (
    <div className="publish-view">
      <div className="view-header">
        <h3>Content Publishing</h3>
        <p className="view-subtitle">Schedule and publish content across multiple platforms</p>
      </div>

      <div className="publish-container">
        <PlatformPublisherForm />
      </div>

      <div className="publish-queue">
        <h4>Publishing Queue</h4>
        <div className="queue-list">
          {[
            { id: 1, title: 'Summer property showcase', platforms: ['Facebook', 'Instagram'], scheduled: 'Today 10:00 AM', status: 'pending' },
            { id: 2, title: 'New luxury villa feature', platforms: ['Instagram', 'LinkedIn'], scheduled: 'Tomorrow 02:00 PM', status: 'pending' },
            { id: 3, title: 'Newsletter Q1 summary', platforms: ['Email'], scheduled: 'Tomorrow 09:00 AM', status: 'pending' }
          ].map(item => (
            <div key={item.id} className="queue-item">
              <div className="item-info">
                <h5>{item.title}</h5>
                <div className="platforms-list">
                  {item.platforms.map((p) => (
                    <span key={p} className="platform-tag">{p}</span>
                  ))}
                </div>
                <p>{item.scheduled}</p>
              </div>
              <span className={`state ${item.status}`}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
