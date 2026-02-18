import React from 'react';

const AlertConfigForm = () => {
    return (
        <div className="card">
            <h2>Alert Configuration</h2>
            <p className="text-muted">Configure how and when you want to be notified.</p>

            <form>
                <div className="form-group">
                    <label>
                        <input type="checkbox" defaultChecked /> Enable In-App Notifications
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        <input type="checkbox" defaultChecked /> Enable Email Notifications
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        <input type="checkbox" /> Enable SMS Notifications
                    </label>
                </div>

                <hr />

                <h4>Events</h4>
                <div className="form-group">
                    <label>
                        <input type="checkbox" defaultChecked /> Notify on PDC Due Today
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        <input type="checkbox" defaultChecked /> Notify 1 Day Before Due Date
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        <input type="checkbox" defaultChecked /> Notify on Cheque Bounce
                    </label>
                </div>

                <div className="form-group">
                    <label>Email Recipients (comma separated)</label>
                    <input type="text" className="form-control" defaultValue="admin@company.com,finance@company.com" />
                </div>

                <button type="button" className="btn btn-primary" onClick={() => alert("Identify Saved! (Mock)")}>Save Configuration</button>
            </form>
        </div>
    );
};

export default AlertConfigForm;
