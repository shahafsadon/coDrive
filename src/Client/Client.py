import socket
import sys

def main():
    if len(sys.argv) != 3:
        print("Usage: python client.py <ip> <port>")
        return

    ip = sys.argv[1]
    port = int(sys.argv[2])

    # SCRUM-70: Initialize socket & connect
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.connect((ip, port))
    except Exception as e:
        print(f"Connection error: {e}")
        return

    while True:
        try:
            # SCRUM-71: Read command from stdin
            cmd = input()

            # Add newline like C++ client
            cmd_to_send = cmd + "\n"

            # SCRUM-72: Send command
            sock.sendall(cmd_to_send.encode())

            # SCRUM-73: Receive response (support multi-line)
            response = ""
            while True:
                chunk = sock.recv(1024)
                if not chunk:
                    # Server disconnected
                    return

                decoded = chunk.decode()
                response += decoded

                # Stop when response ends
                if "\n\n" in response or decoded.endswith("\n"):
                    break

            # SCRUM-74: Print exactly as received
            print(response, end="")

        except EOFError:
            break
        except Exception as e:
            print(f"Error: {e}")
            break

    sock.close()

if __name__ == "__main__":
    main()
