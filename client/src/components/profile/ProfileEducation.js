import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileEducation = ({education: {school, degree, current, to, from, description }}) => {
    return (
        <div>
            <h3 className="text-dartk" >{school} </h3>
            <p>
                <Moment format='MM/DD/YYYY'>{from}</Moment> - {current ? 'Now' : <Moment format='MM/DD/YYYY'>{to}</Moment>}
            </p>
            <p>
                <strong>Degree:</strong> {degree}
            </p>
            {description && <p><strong>Description:</strong>{description}</p>}
        </div>
    )
};

ProfileEducation.propTypes = {
    education: PropTypes.object.isRequired
};

export default ProfileEducation;