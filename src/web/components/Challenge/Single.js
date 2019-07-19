import React from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Card,
  CardText,
  CardBody,
  CardHeader,
  ListGroup,
  ListGroupItem,
} from 'reactstrap';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { errorMessages } from '../../../constants/messages';
import Loading from '../UI/Loading';
import Error from '../UI/Error';

const ChallengeView = ({
  error, loading, challenges, challengeId,
}) => {
  // Loading
  if (loading) return <Loading />;

  // Error
  if (error) return <Error content={error} />;

  // Get this Challenge from all challenges
  let challenge = null;
  if (challengeId && challenges) {
    challenge = challenges.find(item => parseInt(item.id, 10) === parseInt(challengeId, 10));
  }

  // Recipe not found
  if (!challenge) return <Error content={errorMessages.challenge404} />;

  // Build rules listing
  const rules = challenge.rules.map(item => (
    <ListGroupItem key={`${item}`}>{item}</ListGroupItem>
  ));

  return (
    <div>
      <Helmet>
        <title>{challenge.title}</title>
      </Helmet>

      <Row className="pt-4 pt-sm-0">
        <Col sm="12">
          <h1>{challenge.title}</h1>
        </Col>
      </Row>
      <Row>
        <Col lg="4" className="recipe-view-card">
          <Card>
            <CardHeader>About this challenge</CardHeader>
            <CardBody>
              <CardText>{challenge.desc}</CardText>
            </CardBody>
          </Card>
        </Col>
        <Col lg="4" className="recipe-view-card">
          <Card>
            <CardHeader>rules</CardHeader>
            <ListGroup className="list-group-flush">{rules}</ListGroup>
          </Card>
        </Col>
      </Row>
      <Row className="pt-5 pb-3">
        <Col sm="12">
          <Link className="btn btn-secondary" to="/challenges">
            <i className="icon-arrow-left" />
            {' '}
            Back
          </Link>
        </Col>
      </Row>
    </div>
  );
};

ChallengeView.propTypes = {
  error: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  challengeId: PropTypes.string.isRequired,
  challenges: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

ChallengeView.defaultProps = {
  error: null,
};

export default ChallengeView;
