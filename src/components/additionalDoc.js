import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import IconButton from '@material-ui/core/IconButton'
import StarBorderIcon from '@material-ui/icons/StarBorder'
import { Typography } from '@material-ui/core'

import { isMobile } from 'react-device-detect'

const useStyles = makeStyles(theme => ({
  '@global': {
    '*::-webkit-scrollbar': {
      width: '0.1em',
      height: '0.6rem',
      backgroundColor: 'rgba(0,0,0,0.03)'
    },
    '*::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 4px rgba(0,0,0,0.00)'
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,0.08)',
      borderRadius: '0.2rem'
    }
  },
  root: {
    width: '100%',
    marginTop: '1rem',
    borderRadius: '0.5rem',
    marginBottom: '0.5rem',
    padding: '0 1.25rem',
    boxSizing: 'border-box'
  },
  header: {
    fontSize: '1.25em',
    marginTop: '0.75em',
    fontWeight: 500,
    textAlign: 'center'
  },
  headerDesktop: {
    fontSize: '1.5em',
    marginTop: '1.75em',
    marginBottom: '1.25em',
    fontWeight: 500,
    textAlign: 'center'
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)'
  },
  title: {
    color: theme.palette.primary.light,
    fontWeight: 450
  },
  titleBar: {
    background: 'rgba(0, 0, 0, 0.6)'
  },
  gridTile: {
    float: 'left',
    width: '100%',
    minHeight: '22.5vw',
    minWidth: '300px'
  }
}))

export default function AdditionalDoc () {
  const classes = useStyles()
  const activeCause = useSelector(state => state.causes.activeCause)
  const additionalMedia =
    activeCause &&
    activeCause.media_files &&
    activeCause.media_files.map(file => {
      return (
        <GridListTile key={file.id} className={classes.gridTile}>
          <img src={file.media} alt='Media' />
          <GridListTileBar
            title={file.media.split('/').pop()}
            classes={{
              root: classes.titleBar,
              title: classes.title
            }}
          />
        </GridListTile>
      )
    })

  return (
    <React.Fragment>
      <Typography className={isMobile ? classes.header : classes.headerDesktop}>
        Additional Documents
      </Typography>
      <div className={classes.root}>
        <div className={classes.gridroot}>
          <GridList className={classes.gridList} cols={1}>
            {additionalMedia}
          </GridList>
        </div>
      </div>
    </React.Fragment>
  )
}
