var React = require("react");

var Modal = React.createClass({

	propTypes: {
		show: React.PropTypes.bool,
		keyboard: React.PropTypes.bool,
		closeHandler: React.PropTypes.func
	},

	getDefaultProps: function() {
		return {
			show: true,
			keyboard: true
		};
	},

	componentDidMount: function() {
		this.modal({show: this.props.show, keyboard: this.props.keyboard});
	},

	componentWillReceiveProps: function(props) {
		this.modal({show: props.show, keyboard: props.keyboard});
	},

	componentWillUnmount: function() {
		this.modal('hide');
	},

	selector: null,

	modal: function(options) {
		var selector = $(this.selector);
		selector.modal(options);
		selector.on('hidden.bs.modal', function() {
			this.props.closeHandler();
		}.bind(this));
	},

	render: function() {
		// tabIndex -1 fixes esc key not working. See http://stackoverflow.com/questions/12630156
		return (
			<div className="modal fade" tabIndex="-1" ref={function(node) { this.selector = node; }.bind(this)}>
				<div className="modal-dialog modal-lg">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
							<h4 className="modal-title">{this.props.title}</h4>
						</div>
						<div className="modal-body">
							{this.props.children}
						</div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = Modal;