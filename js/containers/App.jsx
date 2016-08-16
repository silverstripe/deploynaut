var React = require("react");
var ReactRedux = require('react-redux');

var StepMenu = require('../components/StepMenu.jsx');
var GitRefSelector = require('./GitRefSelector.jsx');
var ButtonGitFetch = require('./buttons/GitFetch.jsx');
var ButtonGitUpdate = require('./buttons/GitUpdate.jsx');
var SummaryOfChanges = require('./SummaryOfChanges.jsx');
var Approval = require('./Approval.jsx');
var Deployment = require('./Deployment.jsx');
var DeployPlan = require('./DeployPlan.jsx');
var Messages = require('../components/Messages.jsx');

var actions = require('../_actions.js');

function calculateSteps(props) {
	return [
		{
			id: 1,
			show: true,
			title: "Target Release",
			isLoading: props.isLoading[0],
			isFinished: props.isFinished[0],
			content: (
				<div>
					<ButtonGitFetch />
					<ButtonGitUpdate />
					<GitRefSelector />
				</div>
			)
		},
		{
			id: 2,
			title: "Deployment Plan",
			show: props.shaSelected,
			isLoading: props.isLoading[1],
			isFinished: props.isFinished[1],
			content: (
				<div>
					<SummaryOfChanges />
					<DeployPlan />
				</div>
			)
		},
		{
			id: 3,
			title: "Approval",
			show: props.shaSelected,
			isLoading: props.isLoading[2],
			isFinished: props.isFinished[2],
			content: (
				<div>
					<Approval />
				</div>
			)
		},
		{
			id: 4,
			title: "Deployment",
			show: props.shaSelected && props.canDeploy,
			isLoading: props.isLoading[3],
			isFinished: props.isFinished[3],
			content: (
				<div>
					<Deployment />
				</div>
			)
		}
	];
}

function App(props) {

	var steps = calculateSteps(props);

	const content = (
		<div className="deploy-form">
			<div className="header">
				<span className="numberCircle">{steps[props.activeStep].id}</span> {steps[props.activeStep].title}
			</div>
			<Messages
				messages={props.messages}
			/>
			<div>
				{steps[props.activeStep].content}
			</div>
		</div>
	);

	return (
		<div className="row">
			<div className="col-md-12">
				<h3>Deployment options for ...</h3>
			</div>
			<div className="col-md-3">
				<StepMenu
					steps={steps}
					value={props.activeStep}
					onClick={props.onTabClick}
				/>
			</div>
			<div className="col-md-9">
				{content}
			</div>
		</div>
	);
}

const mapStateToProps = function(state) {
	return {
		isLoading: [
			state.git.is_loading || state.git.is_updating,
			state.plan.is_loading,
			false,
			false
		],
		isFinished: [
			state.git.selected_ref !== "",
			state.plan.validation_code === 'success',
			state.plan.validation_code === 'success' && (state.approval.approved || state.approval.bypassed),
			state.deployment.enqueued
		],
		messages: state.messages,
		activeStep: state.activeStep,
		shaSelected: (state.git.selected_ref !== ""),
		canDeploy: (state.approval.approved || state.approval.bypassed)
	};
};

const mapDispatchToProps = function(dispatch) {
	return {
		onTabClick: function(id) {
			dispatch(actions.setActiveStep(id));
		}
	};
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(App);
