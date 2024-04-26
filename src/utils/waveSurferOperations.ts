function paste(instance: any, cutSelection: any) {
  var offlineAudioContext = instance.backend.ac;
  var originalAudioBuffer = instance.backend.buffer;

  let cursorPosition = instance.getCurrentTime();
  var newAudioBuffer = offlineAudioContext.createBuffer(
    originalAudioBuffer.numberOfChannels,
    originalAudioBuffer.length + cutSelection.length,
    originalAudioBuffer.sampleRate
  );

  for (
    var channel = 0;
    channel < originalAudioBuffer.numberOfChannels;
    channel++
  ) {
    var new_channel_data = newAudioBuffer.getChannelData(channel);
    var empty_segment_data = cutSelection.getChannelData(channel);
    var original_channel_data = originalAudioBuffer.getChannelData(channel);

    var before_data = original_channel_data.subarray(
      0,
      cursorPosition * originalAudioBuffer.sampleRate
    );
    var mid_data = empty_segment_data;
    var after_data = original_channel_data.subarray(
      Math.floor(cursorPosition * originalAudioBuffer.sampleRate),
      originalAudioBuffer.length * originalAudioBuffer.sampleRate
    );

    // if(start > 0){
    new_channel_data.set(before_data);
    // new_channel_data.set(empty_segment_data,(cursorPosition * newAudioBuffer.sampleRate));
    new_channel_data.set(mid_data, cursorPosition * newAudioBuffer.sampleRate);
    // new_channel_data.set(after_data,(cutSelection.length * newAudioBuffer.sampleRate));
    new_channel_data.set(
      after_data,
      (cursorPosition + cutSelection.duration) * newAudioBuffer.sampleRate
    );
    // } else {
    //   new_channel_data.set(after_data);
    // }
  }
  return newAudioBuffer;
}

function cut(params: { start: number; end: number }, instance: any) {
  var start = params.start;
  var end = params.end;

  var originalAudioBuffer = instance.backend.buffer;

  var lengthInSamples = Math.floor(
    (end - start) * originalAudioBuffer.sampleRate
  );
  if (!window.OfflineAudioContext) {
    // $('#output').append('failed : no audiocontext found, change browser');
    alert("webkit context not found");
  }
  // var offlineAudioContext = new OfflineAudioContext(1, 2,originalAudioBuffer.sampleRate );
  var offlineAudioContext = instance.backend.ac;

  var emptySegment = offlineAudioContext.createBuffer(
    originalAudioBuffer.numberOfChannels,
    lengthInSamples,
    originalAudioBuffer.sampleRate
  );

  var newAudioBuffer = offlineAudioContext.createBuffer(
    originalAudioBuffer.numberOfChannels,
    start === 0
      ? originalAudioBuffer.length - emptySegment.length
      : originalAudioBuffer.length,
    originalAudioBuffer.sampleRate
  );

  for (
    var channel = 0;
    channel < originalAudioBuffer.numberOfChannels;
    channel++
  ) {
    var new_channel_data = newAudioBuffer.getChannelData(channel);
    var empty_segment_data = emptySegment.getChannelData(channel);
    var original_channel_data = originalAudioBuffer.getChannelData(channel);

    var before_data = original_channel_data.subarray(
      0,
      start * originalAudioBuffer.sampleRate
    );
    var mid_data = original_channel_data.subarray(
      start * originalAudioBuffer.sampleRate,
      end * originalAudioBuffer.sampleRate
    );
    var after_data = original_channel_data.subarray(
      Math.floor(end * originalAudioBuffer.sampleRate),
      originalAudioBuffer.length * originalAudioBuffer.sampleRate
    );

    empty_segment_data.set(mid_data);
    // this.cutSelection = emptySegment
    if (start > 0) {
      new_channel_data.set(before_data);
      // new_channel_data.set(empty_segment_data,(start * newAudioBuffer.sampleRate));
      // new_channel_data.set(after_data,(end * newAudioBuffer.sampleRate));
      new_channel_data.set(after_data, start * newAudioBuffer.sampleRate);
    } else {
      new_channel_data.set(after_data);
    }
  }
  return {
    newAudioBuffer,
    cutSelection: emptySegment,
  };
}

function copy(region: any, instance: any) {
  var segmentDuration = region.end - region.start;

  var originalBuffer = instance.backend.buffer;
  var emptySegment = instance.backend.ac.createBuffer(
    originalBuffer.numberOfChannels,
    segmentDuration * originalBuffer.sampleRate,
    originalBuffer.sampleRate
  );
  for (var i = 0; i < originalBuffer.numberOfChannels; i++) {
    var chanData = originalBuffer.getChannelData(i);
    var emptySegmentData = emptySegment.getChannelData(i);
    var mid_data = chanData.subarray(
      region.start * originalBuffer.sampleRate,
      region.end * originalBuffer.sampleRate
    );
    emptySegmentData.set(mid_data);
  }
  return emptySegment;
}

export { paste, cut, copy };
