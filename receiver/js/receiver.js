var receiver = new cast.receiver.Receiver(
	'21fade73-b41c-4ffb-a899-e3ede4d46a60_1',
	[cast.receiver.RemoteMedia.NAMESPACE],
	'',
	5);

var remoteMedia = new cast.receiver.RemoteMedia();
remoteMedia.addChannelFactory(
	receiver.createChannelFactory(cast.receiver.RemoteMedia.NAMESPACE));

window.addEventListener('load', function() {
	var elem = document.getElementById('vid');
	remoteMedia.setMediaElement(elem);

	var checkStatus = function() {
		var status = document.getElementById('status'),
			st = remoteMedia.getStatus()['state'];

		if (st == 0 || remoteMedia.getStatus()['current_time'] == 0) {
			status.style.display = 'block';
		} else {
			if (st == 1 && remoteMedia.getStatus()['current_time'] > 0) {
				status.innerHTML = 'Paused...';
				status.style.display = 'block';
			} else {
				status.innerHTML = remoteMedia.getStatus()['current_time'];
                status.style.display = 'none';
                elem.style.display = 'block';
			}
		}
	};

	setInterval(checkStatus, 1000);
});

receiver.start();