import { connect } from 'react-redux'
import { solutions, github, gists, messageBar } from '../store/actions'
import selectors from '../store/selectors'
import Header, {
  IHeader,
  IHeaderPropsFromRedux,
  IHeaderActionsFromRedux,
} from '../components/Header'
import { SETTINGS_SOLUTION_ID } from '../constants'
import { getHeaderFabricTheme, getTheme } from '../theme'
import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar'
import { goBack } from 'connected-react-router'

const mapStateToProps = (state, ownProps: IHeader): IHeaderPropsFromRedux => ({
  isSettingsView: ownProps.solution.id === SETTINGS_SOLUTION_ID,
  isLoggedIn: !!selectors.github.getToken(state),
  isWeb: selectors.host.getIsWeb(state),
  profilePicUrl: selectors.github.getProfilePicUrl(state),
  headerFabricTheme: getHeaderFabricTheme(selectors.host.get(state)),
})

const mapDispatchToProps = (dispatch, ownProps: IHeader): IHeaderActionsFromRedux => ({
  login: () => dispatch(github.login.request()),
  logout: () => dispatch(github.logout()),

  goBack: () => dispatch(goBack()),

  editSolution: (solutionId: string, solution: Partial<IEditableSolutionProperties>) =>
    dispatch(solutions.edit({ id: solutionId, solution })),
  deleteSolution: () => dispatch(solutions.remove(ownProps.solution)),

  createPublicGist: () =>
    dispatch(gists.create.request({ solutionId: ownProps.solution.id, isPublic: true })),
  createSecretGist: () =>
    dispatch(gists.create.request({ solutionId: ownProps.solution.id, isPublic: false })),
  updateGist: () => dispatch(gists.update.request({ solutionId: ownProps.solution.id })),
  notifyClipboardCopySuccess: () =>
    dispatch(messageBar.show('Snippet copied to clipboard.')),
  notifyClipboardCopyFailure: () =>
    dispatch(
      messageBar.show('Snippet failed to copy to clipboard.', MessageBarType.error),
    ),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header)
