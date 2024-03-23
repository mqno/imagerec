import {DropZone, Text} from 'react-aria-components';

function Example() {
  let [dropped, setDropped] = React.useState(false);

  return (
    <DropZone
      getDropOperation={(types) => types.has('image/png') ? 'copy' : 'cancel'}
      onDrop={() => {
        setDropped(true);
      }}>
      <Text slot="label">
        {dropped ? "You dropped something" : "Drop object here"}
      </Text>
    </DropZone>
  );
}