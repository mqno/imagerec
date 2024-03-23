function SelectComponent({ devices, startCamera }) {
  const handleSelect = (event) => {
    const selectedDeviceId = event.target.value;
    startCamera(selectedDeviceId);
  };

  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      <select onChange={handleSelect} className="select select-bordered select-lg w-full max-w-xs">
        {devices?.map(device => (
          <option key={device?.deviceId} value={device?.deviceId}>
            {device?.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectComponent;