import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileExperience = ({experience: {
    company,
    title,
    location,
    current,
    to,
    from,
    description
}}) => {
    return (
        <div>
            <h3 className="text-dartk" >{company} </h3>
            <p>
                <Moment format='MM/DD/YYYY'>{from}</Moment> - {current ? 'Now' : <Moment format='MM/DD/YYYY'>{to}</Moment>}
            </p>
            <p>
                <strong>Position:</strong> {title}
            </p>
            {description && <p><strong>Description:</strong>{description}</p>}
        </div>
    )
};

ProfileExperience.propTypes = {
    experience:PropTypes.object.isRequired
};

export default ProfileExperience;