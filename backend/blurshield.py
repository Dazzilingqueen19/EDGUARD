import pyautogui
from PIL import ImageFilter, ImageTk, Image
import tkinter as tk
import threading
import queue

# queue used by other threads to send PIL.Image objects to the Tk thread
_viewer_q = queue.Queue()
_viewer_thread = None

def _tk_thread_main(q):
    root = tk.Tk()
    root.title("BlurShield Viewer")
    # optional: small window
    root.geometry("600x400")
    lbl = tk.Label(root)
    lbl.pack(expand=True, fill="both")

    def poll():
        try:
            img = q.get_nowait()  # expect a PIL.Image.Image
        except queue.Empty:
            root.after(100, poll)
            return

        try:
            photo = ImageTk.PhotoImage(img)
            lbl.config(image=photo)
            lbl.image = photo  # keep reference to avoid GC
        except Exception:
            # defensive: ignore image errors
            pass
        finally:
            root.after(100, poll)

    root.after(100, poll)
    root.mainloop()

def start_viewer():
    global _viewer_thread
    if _viewer_thread and _viewer_thread.is_alive():
        return
    _viewer_thread = threading.Thread(target=_tk_thread_main, args=(_viewer_q,), daemon=True)
    _viewer_thread.start()

def show_image(pil_image):
    """
    Send a PIL.Image.Image to the Tk viewer.

    Usage:
      from blurshield import show_image, start_viewer
      start_viewer()        # call once at server startup (main thread)
      show_image(pil_img)   # call from any thread (e.g. request handler)
    """
    if not isinstance(pil_image, Image.Image):
        raise TypeError("show_image expects a PIL.Image.Image")
    _viewer_q.put(pil_image)

def show_blur_overlay(seconds=4):
    try:
        img = pyautogui.screenshot()
        blurred = img.filter(ImageFilter.GaussianBlur(radius=20))
    except Exception as e:
        print("screenshot failed:", e)
        return

    def _show():
        root = tk.Tk()
        root.attributes("-fullscreen", True)
        root.attributes("-topmost", True)
        root.configure(background='black')
        photo = ImageTk.PhotoImage(blurred)
        lbl = tk.Label(root, image=photo)
        lbl.pack(expand=True, fill='both')
        root.after(int(seconds*1000), root.destroy)
        root.mainloop()


    threading.Thread(target=_show, daemon=True).start()
    t = threading.Thread(target=_show, daemon=True)
    t.start()
